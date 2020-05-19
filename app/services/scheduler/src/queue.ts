import * as amqp from "amqplib"
import * as uniqid from "uniqid"

const EXCHANGE_NAME = "myownradio"
const EXCHANGE_TYPE = "fanout"

interface SubscribeOptions {
  durable?: boolean
  namespace?: string
  autoDelete?: boolean
}

type Unsubscribe = () => void

export class QueueClient {
  private readonly connection: Promise<amqp.Connection>
  private readonly channel: Promise<amqp.Channel>

  constructor(amqpUrl: string) {
    this.connection = amqp.connect(amqpUrl)
    this.channel = this.connection.then(conn => conn.createChannel())
  }

  public async publish<Q extends string, M>(queueName: Q, message: M): Promise<void> {
    const channel = await this.channel
    await channel.publish(EXCHANGE_NAME, queueName, Buffer.from(JSON.stringify(message)))
  }

  public async subscribe<Q extends string, M>(
    queueName: Q,
    subscriber: (message: M) => Promise<void>,
    options: SubscribeOptions = {},
  ): Promise<Unsubscribe> {
    const channel = await this.channel
    const fullQueueName = `${options?.namespace ?? uniqid()}.${queueName}`
    await channel.assertQueue(fullQueueName, {
      durable: options?.durable ?? false,
      autoDelete: options?.autoDelete ?? true,
    })
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true })
    await channel.bindQueue(fullQueueName, EXCHANGE_NAME, queueName)
    const ok = await channel.consume(fullQueueName, async msg => {
      if (msg !== null) {
        const rawContent = msg.content.toString("utf8")
        let message: M
        try {
          message = JSON.parse(rawContent)
        } catch (error) {
          // todo show warning
          channel.ack(msg)
          return
        }

        try {
          await subscriber(message)
          channel.ack(msg)
        } catch (error) {
          channel.nack(msg)
        }
      }
    })

    return (): void => {
      channel.cancel(ok.consumerTag)
    }
  }

  public async close(): Promise<void> {
    await (await this.channel).close()
    await (await this.connection).close()
  }
}

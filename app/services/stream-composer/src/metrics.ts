import { injectable } from "inversify"
import * as Prometheus from "prom-client"

const PREFIX = "mor_stream_composer_"

@injectable()
export class Metrics {
  public readonly radioManagerClientRequestsProcessingSummary = new Prometheus.Summary({
    help: "How long it takes to process a single request to radio manager api",
    labelNames: ["method", "path", "status_code", "error_code"],
    name: `${PREFIX}radiomanager_client_request_processing`,
    percentiles: [0.5, 0.9, 0.95, 0.99],
  })
}

const testTransport = {
  sendMail: jest.fn(),
}

test("Should work", async () => {
  await testTransport.sendMail({
    from: "Sender Name <sender@example.com>",
    to: "Recipient <recipient@example.com>",
    subject: "Nodemailer is unicode friendly ✔",
    text: "Hello to myself!",
    html: "<p><b>Hello</b> to myself!</p>",
  })
})

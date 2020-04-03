import { createUrlFromRoute } from "./router";

describe("createUrlFromRoute", () => {
  it("Should successfully substitute any route parameters", () => {
    const params = { channelId: 10, bar: "OK" };
    expect(createUrlFromRoute("/channels/:channelId/foo/:bar", params)).toBe("/channels/10/foo/OK");
  });

  it("Should successfully pass if no route parameters", () => {
    expect(createUrlFromRoute("/channels/create-channel", {})).toBe("/channels/create-channel");
  });
});

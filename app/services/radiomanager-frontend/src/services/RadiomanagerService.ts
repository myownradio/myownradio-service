import { AbstractApiWithSessionService } from "~/services/abstractApiWithSessionService";
import { SessionService } from "~/services/sessionService";

export class RadiomanagerService extends AbstractApiWithSessionService {
  constructor(radiomanagerUrl: string, sessionService: SessionService) {
    super(radiomanagerUrl, sessionService);
  }
}

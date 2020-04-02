import * as React from "react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDependencies } from "~/bootstrap/dependencies";
import ErrorBox from "~/components/ErrorBox";
import useErrorMessage from "~/components/use/useErrorMessage";
import { config } from "~/config";
import AbstractErrorWithReason from "~/services/errors/AbstractErrorWithReason";

const CreateChannelPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useErrorMessage();

  const { radioManagerService } = useDependencies();
  const history = useHistory();

  const onSubmitSuccess = useCallback(() => {
    history.push(config.routes.profile);
  }, [history]);

  const handleTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMessage(null);

      if (!title) {
        setErrorMessage("ui_create_channel_validator_empty_title");
        return;
      }

      try {
        await radioManagerService.createChannel(title);
        onSubmitSuccess();
      } catch (error) {
        if (error instanceof AbstractErrorWithReason) {
          setErrorMessage(error.localeKey);
        } else {
          setErrorMessage("api_error");
        }
      }
    },
    [title, onSubmitSuccess, setErrorMessage, radioManagerService],
  );

  return (
    <form onSubmit={handleSubmit}>
      <ErrorBox errorMessage={errorMessage} />
      <p>Radio channel title:</p>
      <input id={"channelTitle"} value={title} onChange={handleTitleChange} />
      <button type={"submit"}>Create</button>
    </form>
  );
};

export default CreateChannelPage;

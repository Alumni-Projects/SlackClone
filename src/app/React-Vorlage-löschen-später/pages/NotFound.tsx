import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const NotFound = () => {
  const error = useRouteError();
  // eslint-disable-next-line no-console
  console.error(error);

  const getErrorText = (): string => {
    if (isRouteErrorResponse(error)) {
      return error.statusText;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown Error';
  };

  const errorText = getErrorText();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred:</p>
      <p>
        <i>{errorText}</i>
      </p>
    </div>
  );
};

export default NotFound;

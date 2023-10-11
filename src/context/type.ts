export type loggedInUserType = {
  id: string;
  name: string;
  profileUrl: string;
  status: string;
};

export interface User {
  id: string;
  name: string;
  profileUrl: string;
  userName: string;
  status: string;
  designation: string;
  company: string;
  linkedInUrl: string;
  twitterUrl: string;
  githubUrl: string;
  token: string;
}

export interface ErrorData {
  isError: boolean;
  errorMessage: string;
  handleError?: () => void;
}

export interface CurrentStatusPayload {
  currentStatus: {
    from: number;
    message: string;
    state: string;
    until: number;
    updateAt: number;
  };
}

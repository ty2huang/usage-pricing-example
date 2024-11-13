export interface User {
  username: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Event {
  execution_time: number;
  response_size_bytes: number;
  duration_ms: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  token2: string | null;
  login: (credentials: Credentials) => Promise<boolean>;
  logout: () => void;
}
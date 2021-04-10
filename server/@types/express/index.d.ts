declare namespace Express {
  interface Request {
    rooms: Map<string, Set<string>>;
  }
}

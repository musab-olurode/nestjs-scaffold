export interface SeederServiceProvider {
  create: () => Promise<void>;
}

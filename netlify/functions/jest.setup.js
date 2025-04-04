jest.setTimeout(30000); // 30 second global timeout

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  // Don't use fake timers by default
  jest.useRealTimers();
});

afterEach(async () => {
  jest.restoreAllMocks();
  await new Promise(resolve => setTimeout(resolve, 100));
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
});

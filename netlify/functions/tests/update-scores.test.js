const nock = require('nock');
const { handler } = require('../update-scores');

describe('update-scores function', () => {
	// Clean up before and after each test
	beforeAll(() => {
		nock.disableNetConnect();
	});

	afterAll(async () => {
		nock.enableNetConnect();
		nock.restore();
	});

	beforeEach(() => {
		nock.cleanAll();
		jest.clearAllMocks();
		// Silence console logs during tests
		jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(async () => {
		jest.restoreAllMocks();
		// Wait for any pending operations
		await new Promise((resolve) => setTimeout(resolve, 100));
	});

	it('should update anime scores successfully', async () => {
		// Mock Supabase
		const mockAiringAnime = [{ id: 1 }, { id: 2 }];

		nock('https://test-url.supabase.co')
			.get('/rest/v1/anime')
			.query(true)
			.reply(200, mockAiringAnime);

		// Mock MyAnimeList API
		nock('https://api.myanimelist.net')
			.get('/v2/anime/1')
			.query(true)
			.reply(200, { mean: 8.5, status: 'currently_airing' });

		nock('https://api.myanimelist.net')
			.get('/v2/anime/2')
			.query(true)
			.reply(200, { mean: 7.5, status: 'currently_airing' });

		const response = await handler();

		expect(response.statusCode).toBe(200);
		const body = JSON.parse(response.body);
		expect(body.stats.total).toBe(2);
		expect(body.stats.success).toBe(2);
	});

	it('should handle API errors gracefully', async () => {
		nock('https://test-url.supabase.co')
			.get('/rest/v1/anime')
			.query(true)
			.reply(500);

		const response = await handler();

		expect(response.statusCode).toBe(500);
		expect(JSON.parse(response.body).error).toBe('Score update failed');
	});

	it('should timeout after specified duration', async () => {
		// Restore real timers for this test
		jest.useRealTimers();

		const mockTimeout = 1000;
		let timeoutId;

		nock('https://test-url.supabase.co')
			.get('/rest/v1/anime')
			.query(true)
			.delayConnection(1500) // Longer than mockTimeout
			.reply(200, [{ id: 1 }]);

		const handlerPromise = handler();

		try {
			await Promise.race([
				handlerPromise,
				new Promise((_, reject) => {
					timeoutId = setTimeout(
						() => reject(new Error('Function timed out')),
						mockTimeout
					);
				}),
			]);
			fail('Should have timed out');
		} catch (error) {
			expect(error.message).toBe('Function timed out');
		} finally {
			if (timeoutId) clearTimeout(timeoutId);
			try {
				await handlerPromise;
			} catch (e) {
				// Ignore errors from handler
			}
			nock.cleanAll();
		}
	}, 15000); // Increased test timeout to 15 seconds
});

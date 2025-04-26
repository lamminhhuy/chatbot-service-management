// import "reflect-metadata";
// import { vi, describe, it, expect, beforeEach } from "vitest";
// import { Repository } from "typeorm";
// import { Subscription } from "../models/Subscription";
// import SubscriptionService from "../services/SubscriptionService";
// import { BillingCycle } from "../enums/BillingCycle";
// function createMockRepository() {
//   return {
//     create: vi.fn().mockImplementation((data) => data), 
//     save: vi.fn().mockImplementation((data) => Promise.resolve(data)), 
//   } as const;
// }

// describe("SubscriptionService", () => {
//   let mockRepository: ReturnType<typeof createMockRepository>;
//   let subscriptionService: SubscriptionService;

//   beforeEach(() => {
//     mockRepository = createMockRepository();
//     subscriptionService = new SubscriptionService(mockRepository as unknown as Repository<Subscription>);
//   });

//   it("should successfully create the subscription", async () => {
//     const input = {
//       name: "Basic Plan",
//       code: "BASIC_PLAN",
//       price: 10.0,
//       billingCycle: BillingCycle.MONTHLY,
//       description: "For basic users",
//       metadata: null,
//       queryTokenLimit: 10,
//     };

//     const mockCreatedEntity = {
//       ...input,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       deletedAt: null,
//     };

//     mockRepository.create.mockReturnValue(mockCreatedEntity);
//     mockRepository.save.mockResolvedValue(mockCreatedEntity);

//     const result = await subscriptionService.create(input);

//     expect(mockRepository.create).toHaveBeenCalledWith(input);
//     expect(mockRepository.save).toHaveBeenCalledWith(mockCreatedEntity);

//     expect(result).toEqual({
//       ...input,
//       createdAt: expect.any(String),
//       updatedAt: expect.any(String),
//       deletedAt: null,
//     });
//   });
// });
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { NotFoundError } from '@dbbs/common'
import { mockDeep, mockReset } from 'jest-mock-extended'

import { UserController } from '../../controllers/user.controller.js'
import { OrganizationService } from '../../services/organization.service.js'
import { OrganizationController } from '../../controllers/organization.controller.js'
import { defaultOrganization } from '../mocks/index.js'

describe(UserController.name, () => {
  let controller: UserController
  const mockOrganizationService = mockDeep<OrganizationService>()

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      controllers: [UserController],
      providers: [OrganizationService]
    })
      .overrideProvider(OrganizationService)
      .useValue(mockOrganizationService)
      .compile()
    controller = module.get<UserController>(UserController)
  })

  beforeEach(() => {
    mockReset(mockOrganizationService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe(UserController.prototype.getUserOrganizations.name, () => {
    it.each([
      {
        name: 'should successfully fetch user organizations',
        userId: 1,
        expectedResult: [defaultOrganization],
        setupMocks: () => {
          mockOrganizationService.getUserOrganizations.mockResolvedValueOnce([defaultOrganization])
        }
      },
      {
        name: 'should throw an error if failed to fetch user organizations',
        userId: 1,
        expectedError: new NotFoundError(`User with ID 1 does not exist`),
        setupMocks: () => {
          mockOrganizationService.getUserOrganizations.mockRejectedValueOnce(
            new NotFoundError(`User with ID 1 does not exist`)
          )
        }
      }
    ])('$name', async ({ userId, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = controller.getUserOrganizations(userId)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }

      expect(mockOrganizationService.getUserOrganizations).toHaveBeenCalledWith(userId)
    })
  })
})

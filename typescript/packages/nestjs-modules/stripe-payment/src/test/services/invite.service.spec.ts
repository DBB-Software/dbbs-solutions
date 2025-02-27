import { Test } from '@nestjs/testing'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { BadRequestException, NotFoundException } from '@nestjs/common'

import { InviteService } from '../../services/index.js'
import { OrganizationRepository, UserRepository, InviteRepository } from '../../repositories/index.js'
import { defaultInviteEntity, createInvitePayload } from '../mocks/invite.mock.js'
import { IAcceptInvite, ICancelInvite, ICreateInvite, IInvite } from '../../interfaces/invite.interface.js'
import { InviteEntity } from '../../entites/invite.entity.js'

describe(InviteService.name, () => {
  let service: InviteService
  const mockInviteRepository = mockDeep<InviteRepository>()
  const mockUserRepository = mockDeep<UserRepository>()
  const mockOrganizationRepository = mockDeep<OrganizationRepository>()

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [InviteService, InviteRepository, UserRepository, OrganizationRepository]
    })
      .overrideProvider(InviteRepository)
      .useValue(mockInviteRepository)
      .overrideProvider(OrganizationRepository)
      .useValue(mockOrganizationRepository)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile()

    service = module.get<InviteService>(InviteService)
  })

  beforeEach(() => {
    mockReset(mockInviteRepository)
  })

  describe(InviteService.prototype.createInvite.name, () => {
    it.each<{
      name: string
      params: [ICreateInvite]
      setupMocks: () => void
      expectedResult?: IInvite
      expectedError?: Error
    }>([
      {
        name: 'should successfully create invite',
        params: [{ ...createInvitePayload(1) }],
        setupMocks: () => {
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockOrganizationRepository.organizationExists.mockResolvedValueOnce(true)
          mockInviteRepository.createInvite.mockResolvedValueOnce(defaultInviteEntity(1))
        },
        expectedResult: defaultInviteEntity(1)
      },
      {
        name: 'should throw BadRequestException if user with current id does not exist',
        params: [{ ...createInvitePayload(1) }],
        setupMocks: () => {
          mockUserRepository.doesUserExist.mockResolvedValueOnce(false)
        },
        expectedError: new BadRequestException(`User with ID ${1} does not exist`)
      },
      {
        name: 'should throw BadRequestException if organization with current id does not exist',
        params: [{ ...createInvitePayload(1) }],
        setupMocks: () => {
          mockUserRepository.doesUserExist.mockResolvedValueOnce(true)
          mockOrganizationRepository.organizationExists.mockResolvedValueOnce(false)
        },
        expectedError: new BadRequestException(`Organization with ID ${1} does not exist`)
      }
    ])('$name', async ({ params, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.createInvite(...params)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe(InviteService.prototype.acceptInvite.name, () => {
    it.each<{
      name: string
      params: [IAcceptInvite]
      setupMocks: () => void
      expectedResult?: boolean
      expectedError?: Error
    }>([
      {
        name: 'should successfully accept the invite',
        params: [{ inviteId: 1 }],
        expectedResult: true,
        setupMocks: () => {
          mockInviteRepository.updateInviteStatus.mockResolvedValueOnce(defaultInviteEntity(1))
        }
      },
      {
        name: 'should throw NotFoundException if invite with current id does not exist',
        params: [{ inviteId: 1 }],
        expectedError: new NotFoundException(`Invite with ID 1 does not exist`),
        setupMocks: () => {
          mockInviteRepository.updateInviteStatus.mockResolvedValueOnce(null)
        }
      }
    ])('$name', async ({ params, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.acceptInvite(...params)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe(InviteService.prototype.cancelInvite.name, () => {
    it.each<{
      name: string
      params: [ICancelInvite]
      setupMocks: () => void
      expectedResult?: boolean
      expectedError?: Error
    }>([
      {
        name: 'should successfully cancel the invite',
        params: [{ inviteId: 1 }],
        expectedResult: true,
        setupMocks: () => {
          mockInviteRepository.updateInviteStatus.mockResolvedValueOnce(defaultInviteEntity(1))
        }
      },
      {
        name: 'should throw NotFoundException if invite with current id does not exist',
        params: [{ inviteId: 1 }],
        expectedError: new NotFoundException(`Invite with ID 1 does not exist`),
        setupMocks: () => {
          mockInviteRepository.updateInviteStatus.mockResolvedValueOnce(null)
        }
      }
    ])('$name', async ({ params, expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.cancelInvite(...params)

      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toThrow(expectedError)
      }
    })
  })

  describe(InviteService.prototype.getInviteById.name, () => {
    it.each<{
      name: string
      params: number
      expectedResult: InviteEntity | null
      setupMocks: () => void
    }>([
      {
        name: 'should find invite by inviteId',
        params: 1,
        expectedResult: defaultInviteEntity(1),
        setupMocks: () => {
          mockInviteRepository.getInviteById.mockResolvedValueOnce(defaultInviteEntity(1))
        }
      },
      {
        name: 'should return null when invite not found',
        params: 999,
        expectedResult: null,
        setupMocks: () => {
          mockInviteRepository.getInviteById.mockResolvedValueOnce(null)
        }
      }
    ])('$name', async ({ params, expectedResult, setupMocks }) => {
      setupMocks()
      const result = await service.getInviteById(params)

      expect(result).toEqual(expectedResult)
    })
  })
})

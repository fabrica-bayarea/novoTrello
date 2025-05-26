import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CreateBoardMemberDto } from "src/dto/create-boardmember.dto";


@Injectable()
export class BoardMemberService {
    constructor(private prisma: PrismaService) {}

    async addMember(currentUserId: number, dto: CreateBoardMemberDto) {
        const {boardId, userId} = dto;

        const checkExistentBoard = await this.prisma.board.findUnique({
            where: {id: boardId}
        })
        if (!checkExistentBoard) {
            throw new NotFoundException('Board not found')
        }
        if (checkExistentBoard.userId !== currentUserId) {
            throw new ForbiddenException('You do not have permission to do that')
        }

        const checkUser = await this.prisma.board.findUnique({
            where: {id: userId}
        })
        if (!checkUser) {
            throw new NotFoundException('User not found')
        }

        try {
            return await this.prisma.boardMember.create({
                data: {
                    boardId,
                    userId,
                }
            })
        } catch (err) {
            throw new ConflictException('User already a member in this board')
        }
    }

    async removeMember(currentUserId: number, boardId: number, userId: number) {
        const checkBoard = await this.prisma.user.findUnique({
            where:{id:boardId}
        })

        if (!checkBoard) {
            throw new NotFoundException('Board not found')
        }
        if (checkBoard.id !== currentUserId) {
            throw new ForbiddenException('You do not have permission')
        }

        return await this.prisma.boardMember.delete(({
            where:{boardId_userId: {
                boardId,
                userId
            }}
        }))
    }

    async listMembers(boardId: number) {
        return this.prisma.boardMember.findMany({
            where: {
                boardId
            },
            include: {
                user:{
                    select:{
                        id: true, 
                        fullName: true, 
                        email:true
                    }
                }
            }
        })
    }
}
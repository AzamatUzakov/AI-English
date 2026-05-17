import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
export declare class DiaryController {
    private readonly diaryService;
    constructor(diaryService: DiaryService);
    create(createDiaryDto: CreateDiaryDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDiaryDto: UpdateDiaryDto): string;
    remove(id: string): string;
}

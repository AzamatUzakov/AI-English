import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
export declare class DiaryService {
    create(createDiaryDto: CreateDiaryDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDiaryDto: UpdateDiaryDto): string;
    remove(id: number): string;
}

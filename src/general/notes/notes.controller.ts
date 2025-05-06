import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { AddNoteDto } from './dto/notes.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('submit')
  async submitNote(@Body() dto: AddNoteDto) {
    return this.notesService.addNote(dto);
  }
}

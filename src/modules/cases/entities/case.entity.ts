import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Case {
    @Prop({ required: true })
    bankName: string;

    @Prop({ required: true })
    propertyName: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    borrowerName: string;

    @Prop({ required: true })
    createdAt: Date;
}

export type CaseDocument = Document & Case;
export const CaseSchema = SchemaFactory.createForClass(Case);

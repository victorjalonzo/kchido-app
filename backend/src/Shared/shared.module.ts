import { Global, Module } from "@nestjs/common";
import { SharedRepository } from "./shared.repository";

@Global()
@Module({
  providers: [SharedRepository],
  exports: [SharedRepository],
})
export class SharedModule {}
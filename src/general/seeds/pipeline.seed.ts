import { Pipeline } from '../../pipelines/entities/pipeline.entity';
import { PipelineStage } from '../../pipelines/entities/pipeline-stage.entity'
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config(); 


const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Pipeline,PipelineStage], // entities here
  synchronize: true, // Keep false to avoid auto-syncing during script execution
});



const seed = async () => {
    console.log("📡 Connecting to database...");
  await AppDataSource.initialize();
  console.log("✅ Connected!");

  const pipelineRepo = AppDataSource.getRepository(Pipeline);
  const stageRepo = AppDataSource.getRepository(PipelineStage);

  const data = [
    {
      id: 1,
      name: "Real Estate Leads",
      pipestages: [
        { id: 1, name: "Lead In" },
        { id: 2, name: "Contact Made" },
        { id: 3, name: "Demo Scheduled" }
      ]
    },
    {
      id: 47,
      name: "IndiaMart",
      pipestages: [
        { id: 236, name: "Lead In" },
        { id: 237, name: "Contact Made" },
        { id: 238, name: "Demo Scheduled" },
        { id: 239, name: "Proposal Made" },
        { id: 240, name: "Negotiations Started" }
      ]
    },
    {
      id: 48,
      name: "TradeIndia",
      pipestages: [
        { id: 241, name: "Lead In" },
        { id: 242, name: "Contact Made" },
        { id: 243, name: "Demo Scheduled" },
        { id: 244, name: "Proposal Made" },
        { id: 245, name: "Negotiations Started" }
      ]
    },
    {
      id: 28,
      name: "New Pipeline",
      pipestages: [
        { id: 141, name: "Lead In" },
        { id: 142, name: "Contact Made" },
        { id: 143, name: "Demo Scheduled" },
        { id: 144, name: "Proposal Made" },
        { id: 145, name: "Negotiations Started" }
      ]
    },
    {
      id: 19,
      name: "Testing",
      pipestages: [
        { id: 93, name: "Lead In 2" },
        { id: 94, name: "Contact Made 2" },
        { id: 95, name: "Demo Scheduled 2" },
        { id: 96, name: "Proposal Made" },
        { id: 97, name: "Negotiations Started" }
      ]
    }
  ];

  for (const pipeline of data) {
    const newPipeline = pipelineRepo.create({
      id: pipeline.id,
      name: pipeline.name,
      pipestages: pipeline.pipestages.map((stage) =>
        stageRepo.create({ id: stage.id, name: stage.name })
      )
    });

    await pipelineRepo.save(newPipeline);
  }

  console.log("✅ Pipelines and stages seeded successfully.");
  process.exit(0);
};

seed().catch((error) => {
  console.error('❌ Error seeding pipelines:', error);
  process.exit(1);
});

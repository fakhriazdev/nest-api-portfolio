-- CreateEnum
CREATE TYPE "Stack" AS ENUM ('FULLSTACK', 'FRONTEND', 'BACKEND');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVE', 'IDLE');

-- CreateTable
CREATE TABLE "m_education" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "m_education_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "m_profile" (
    "uuid" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "m_profile_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "m_project" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "stack" "Stack" NOT NULL DEFAULT 'FULLSTACK',
    "AuthorName" TEXT NOT NULL,

    CONSTRAINT "m_project_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "m_technology" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "ProfileId" TEXT NOT NULL,

    CONSTRAINT "m_technology_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "m_testimonial" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "by" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'IDLE',
    "profileUuid" TEXT,
    "toUsername" TEXT NOT NULL,

    CONSTRAINT "m_testimonial_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "m_user" (
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileUuid" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "m_profile_username_key" ON "m_profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "m_user_username_key" ON "m_user"("username");

-- AddForeignKey
ALTER TABLE "m_education" ADD CONSTRAINT "m_education_username_fkey" FOREIGN KEY ("username") REFERENCES "m_user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_project" ADD CONSTRAINT "m_project_AuthorName_fkey" FOREIGN KEY ("AuthorName") REFERENCES "m_user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_technology" ADD CONSTRAINT "m_technology_ProfileId_fkey" FOREIGN KEY ("ProfileId") REFERENCES "m_profile"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_technology" ADD CONSTRAINT "m_technology_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "m_project"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_testimonial" ADD CONSTRAINT "m_testimonial_profileUuid_fkey" FOREIGN KEY ("profileUuid") REFERENCES "m_profile"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_testimonial" ADD CONSTRAINT "m_testimonial_toUsername_fkey" FOREIGN KEY ("toUsername") REFERENCES "m_user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_user" ADD CONSTRAINT "m_user_profileUuid_fkey" FOREIGN KEY ("profileUuid") REFERENCES "m_profile"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

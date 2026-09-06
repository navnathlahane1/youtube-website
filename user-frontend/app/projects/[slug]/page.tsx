import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FolderGit2, Github, ExternalLink, Download, ChevronLeft, CheckCircle2, Cpu } from 'lucide-react';
import { getProjectBySlug } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return { title: 'Engineering Project' };

  return {
    title: `${project.title} | Capstone Engineering Project`,
    description: project.abstract || project.description,
  };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/projects" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> All Projects
          </Link>
          <span>/</span>
          <span className="font-semibold text-cyan-600 dark:text-cyan-400 truncate">{project.title}</span>
        </div>

        {/* Project Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" size="md">
                {project.category}
              </Badge>
              <Badge variant="outline" size="md">
                {project.difficulty} Level
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {project.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              {project.abstract}
            </p>
          </div>

          {/* Tech Stack */}
          {project.techStack && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Technologies Used:</span>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Core Engineering Features:</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {project.features.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hardware List if applicable */}
          {project.hardwareRequired && project.hardwareRequired.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" /> Hardware Components & Test Benches:
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.hardwareRequired.map((hw: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    {hw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="md">
                  <Github className="w-4 h-4 mr-2" /> GitHub Repository
                </Button>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary" size="md">
                  <ExternalLink className="w-4 h-4 mr-2" /> Live Project Demo
                </Button>
              </a>
            )}
            {project.reportPdfUrl && (
              <a href={project.reportPdfUrl} target="_blank" rel="noreferrer">
                <Button variant="primary" size="md">
                  <Download className="w-4 h-4 mr-2" /> Project Report PDF
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

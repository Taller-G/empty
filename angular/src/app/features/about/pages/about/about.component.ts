import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  readonly skills: string[] = [
    'TypeScript',
    'Angular',
    'Node.js',
    'Clean Architecture',
    'REST APIs',
    'PostgreSQL',
  ];

  readonly experiences: { role: string; company: string; period: string; description: string }[] = [
    {
      role: 'Full-Stack Developer',
      company: 'dasdasdd',
      period: '2022 – Present',
      description:
        'Architecting and delivering scalable web applications using Angular, Node.js and PostgreSQL following Clean Architecture principles.',
    },
    {
      role: 'Frontend Developer',
      company: 'Tech Startup',
      period: '2020 – 2022',
      description:
        'Built responsive SPAs and design systems, improving performance and developer experience across multiple product teams.',
    },
  ];
}

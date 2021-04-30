import { Component } from './base-component';
import { ProjectItem } from './project-items';
import { DragTarget } from '../models/drag-drop';
import { Project, ProjectStatus } from '../models/project';
import { projectState } from '../state/project-state';
import { Autobind } from '../decorators/autobind';

export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget {
    assignedProject: Project[] = [];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
        if (
            event.dataTransfer &&
            event.dataTransfer.types[0] === 'text/plain'
        ) {
            event.preventDefault();
            const listEl = this.content.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @Autobind
    dropHandler(event: DragEvent) {
        const projectId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(
            projectId,
            this.type === 'active'
                ? ProjectStatus.Active
                : ProjectStatus.Finished
        );
    }

    @Autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.content.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    configure() {
        this.content.addEventListener('dragover', this.dragOverHandler);
        this.content.addEventListener('dragleave', this.dragLeaveHandler);
        this.content.addEventListener('drop', this.dropHandler);

        projectState.addListeners((projects: Project[]) => {
            this.assignedProject = projects.filter((proj) =>
                this.type === 'active'
                    ? proj.status === ProjectStatus.Active
                    : proj.status === ProjectStatus.Finished
            );
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.content.querySelector('ul')!.id = listId;
        this.content.querySelector('h2')!.textContent =
            this.type.toUpperCase() + 'PROJECTS';
    }

    private renderProjects() {
        const listEl = document.getElementById(
            `${this.type}-projects-list`
        )! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const projItem of this.assignedProject) {
            new ProjectItem(listEl.id, projItem);
        }
    }
}

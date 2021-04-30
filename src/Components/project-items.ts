import { Component } from './base-component';
import { Draggable } from '../models/drag-drop';
import { Project } from '../models/project';
import { Autobind } from '../decorators/autobind';

export class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {
    private project: Project;

    get persons() {
        return this.project.people > 1
            ? `${this.project.people} Persons Assigned`
            : '1 Person Assigned';
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_: DragEvent) {
        console.log('Drag End');
    }

    configure() {
        this.content.addEventListener('dragstart', this.dragStartHandler);
        this.content.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
        this.content.querySelector('h2')!.textContent = this.project.title;
        this.content.querySelector('h3')!.textContent = this.persons;
        this.content.querySelector('p')!.textContent = this.project.description;
    }
}

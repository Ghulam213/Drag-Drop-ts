import { Component } from './base-component';
import { projectState } from '../state/project-state';
import { Autobind } from '../decorators/autobind';
import { validatable, validate } from '../util/validation';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputEl: HTMLInputElement;
    descriptionInputEl: HTMLInputElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.titleInputEl = this.content.querySelector(
            '#title'
        )! as HTMLInputElement;
        this.descriptionInputEl = this.content.querySelector(
            '#description'
        )! as HTMLInputElement;
        this.peopleInputEl = this.content.querySelector(
            '#people'
        )! as HTMLInputElement;

        this.configure();
    }

    configure() {
        this.content.addEventListener('submit', this.submitHandler);
    }

    renderContent() {}

    private gatherUserInput(): [string, string, number] | void {
        const title = this.titleInputEl.value;
        const description = this.descriptionInputEl.value;
        const people = this.peopleInputEl.value;

        const tilteValidatable: validatable = {
            value: title,
            required: true,
        };

        const descriptionValidatable: validatable = {
            value: description,
            required: true,
            minLength: 5,
        };

        const peopleValidatable: validatable = {
            value: +people,
            required: true,
            min: 1,
            max: 50,
        };

        if (
            !validate(tilteValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert('Invalid Input, Please try again!');
            return;
        }

        return [title, description, +people];
    }

    private clearInput() {
        this.titleInputEl.value = '';
        this.descriptionInputEl.value = '';
        this.peopleInputEl.value = '';
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (userInput) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInput();
        }
    }
}

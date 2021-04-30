export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEl: HTMLTemplateElement;
    hostEl: T;
    content: U;

    constructor(
        templateId: string,
        holdId: string,
        insertAtStart: boolean,
        newElementId?: string
    ) {
        this.templateEl = document.getElementById(
            templateId
        )! as HTMLTemplateElement;
        this.hostEl = document.getElementById(holdId)! as T;

        const importedContent = document.importNode(
            this.templateEl.content,
            true
        );
        this.content = importedContent.firstElementChild as U;
        if (newElementId) {
            this.content.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    abstract configure(): void;
    abstract renderContent(): void;

    private attach(insertAtStart: boolean) {
        this.hostEl.insertAdjacentElement(
            insertAtStart ? 'afterbegin' : 'beforeend',
            this.content
        );
    }
}

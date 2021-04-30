import { Project, ProjectStatus } from '../models/project';
type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListeners(listenersFn: Listener<T>) {
        this.listeners.push(listenersFn);
    }
}

export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new ProjectState();
        }
        return this.instance;
    }

    addProject(title: string, description: string, peepleNo: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            peepleNo,
            ProjectStatus.Active
        );
        this.projects.push(newProject);
        this.invokeListeners();
    }

    // switch project status
    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find((proj) => proj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.invokeListeners();
        }
    }

    private invokeListeners() {
        for (const listeners of this.listeners) {
            listeners(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();

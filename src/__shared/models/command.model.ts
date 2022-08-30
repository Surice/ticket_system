export interface Command {
    permission: string;
    requireArgs: boolean;
    help: string;
    method: Function;
    dm?: boolean;
}
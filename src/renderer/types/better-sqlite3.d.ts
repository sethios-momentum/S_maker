declare module 'better-sqlite3' {
    namespace Database {
        interface Database {
            prepare(sql: string): Statement;
            exec(sql: string): void;
            close(): void;
            transaction<T extends (...args: any[]) => any>(fn: T): T;
            pragma(pragma: string, simplify?: boolean): any;
            checkpoint(databaseName?: string): void;
            memory: boolean;
            readonly name: string;
            readonly open: boolean;
            readonly inTransaction: boolean;
        }

        interface Statement {
            run(...params: any[]): { changes: number; lastInsertRowid: number };
            get(...params: any[]): any;
            all(...params: any[]): any[];
            iterate(...params: any[]): IterableIterator<any>;
            bind(...params: any[]): this;
            columns(): { name: string }[];
            raw(raw?: boolean): this;
            pluck(pluck?: boolean): this;
            expand(expand?: boolean): this;
            readonly reader: boolean;
            readonly source: string;
            readonly database: string;
            readonly returnsData: boolean;
        }

        interface Options {
            readonly?: boolean;
            fileMustExist?: boolean;
            timeout?: number;
            verbose?: Function;
        }
    }

    function Database(filename: string, options?: Database.Options): Database.Database;
    
    export = Database;
}
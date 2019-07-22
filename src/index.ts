import io from 'socket.io-client'

export class FireSQL {
    socket: SocketIOClient.Socket;
    tableName: string;
    whereString: string;
    constructor(url: string) {
        // eslint-disable-next-line no-console
        console.log('initialize')
        this.socket = io(url)
    }

    on(table: string, callback: Function) {
        this.socket.emit('_enter_room', table)
        this.socket.on(table, callback)
    }

    query(sql: string) {
        // eslint-disable-next-line no-console
        console.log(sql)
        this._clearSQL()
        // eslint-disable-next-line prettier/prettier
        return new Promise(resolve => this.socket.emit('_query', sql, resolve))
    }

    _clearSQL() {
        this.tableName = ''
        this.whereString = ''
    }

    table(tableName: string) {
        this.tableName = tableName
        return this
    }

    where(...args: any[]) {
        if (args.length === 2) args = [args[0], '=', args[1]]
        const condition = `${args[0]}${args[1]}${this._grandEscape(args[2])}`
        if (this.whereString) {
            this.whereString += ` AND ${condition}`
        } else {
            this.whereString = ` WHERE ${condition}`
        }
        return this
    }

    select(...columns: any[]) {
        const columnsString = columns.length ? columns.join(', ') : '*'
        const sql = `SELECT ${columnsString} FROM ${this.tableName}${this.whereString}`
        // eslint-disable-next-line prettier/prettier
        return new Promise(resolve => this.query(sql).then(resolve))
    }

    insert(...valuesArray: {}[]) {
        const columnsString = Object.keys(valuesArray[0]).join(', ')
        const valuesArrayString = valuesArray
            // eslint-disable-next-line prettier/prettier
            .map(values => `(${Object.values(values).map(this._grandEscape).join(', ')})`)
            .join(', ')
        const sql = `INSERT INTO ${this.tableName} (${columnsString}) VALUES ${valuesArrayString}`
        // eslint-disable-next-line prettier/prettier
        return new Promise(resolve => this.query(sql).then(resolve))
    }

    update(values: ArrayLike<unknown> | { [s: string]: unknown; }) {
        const valuesString = Object.entries(values)
            .map(([column, value]) => `${column}=${this._grandEscape(value)}`)
            .join(', ')
        const sql = `UPDATE ${this.tableName} SET ${valuesString}${this.whereString}`
        // eslint-disable-next-line prettier/prettier
        return new Promise(resolve => this.query(sql).then(resolve))
    }

    delete() {
        const sql = `DELETE FROM ${this.tableName}${this.whereString}`
        // eslint-disable-next-line prettier/prettier
        return new Promise(resolve => this.query(sql).then(resolve))
    }

    _grandEscape(data: unknown) {
        switch (typeof data) {
            case 'string':
                return `'${data.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`
            default:
                return data
        }
    }
}

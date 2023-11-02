import mysql, {PoolOptions, RowDataPacket, ResultSetHeader} from 'mysql2';
import dotenv from 'dotenv'

dotenv.config()

const access: PoolOptions = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

const conn = mysql.createPool(access).promise();

export const getNotes = async () => {
    const [rows] = await conn.query('select * from notes')
    return rows
}
export const getNote = async (id: string) => {
    const [row] = await conn.query(`
        select *
        from notes
        where id = ?
    `, [id])
    return (row as RowDataPacket)[0]
}
export const createNote = async (title: string, contents: string) => {
    const [result] = await conn.query(`
        insert into notes(title, contents)
        values (?, ?)
    `, [title, contents])
    const id = (result as ResultSetHeader).insertId
    return getNote(id.toString())
}

// getNotes().then(notes => console.log('getNotes()', notes))
// getNote('3').then(note => console.log('getNote()', note))
// createNote('name', 'samantha').then(result => console.log('createNote', result))
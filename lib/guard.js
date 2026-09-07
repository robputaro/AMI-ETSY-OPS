import { redirect } from 'next/navigation';
import { isAuthed } from './session';
export async function requireAuth(){ if(!(await isAuthed())) redirect('/login'); }

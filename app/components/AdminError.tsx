export default function AdminError({ message }: { message?: string }) {
  return message ? <p className="form-error admin-error" role="alert">{message}</p> : null;
}

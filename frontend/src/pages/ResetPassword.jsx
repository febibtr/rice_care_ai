import { Link } from 'react-router-dom';

export default function ResetPassword() {
  return (
    <div className="reset-page">
      <div className="reset-card">
        <h5>Lupa Password</h5>
        <p>
          kami akan mengirimkan email berisi tautan reset password yang akan memungkinkan Anda untuk membuat yang baru.
        </p>
        <div className="input-group mb-3">
          <span className="input-group-text"><i className="bi bi-envelope"></i></span>
          <input className="form-control" type="email" placeholder="alamat email" />
        </div>
        <button className="btn btn-dark w-100" type="button">Kirim Tautan Reset Password</button>
        <div className="mt-3 text-center">
          <Link to="/login" className="small-link">Kembali ke login</Link>
        </div>
      </div>
    </div>
  );
}

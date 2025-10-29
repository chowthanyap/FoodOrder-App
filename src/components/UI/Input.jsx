export default function Input({ label, id, ...props }) {
    return (
        <p className="control">
            <label className="input-label" htmlFor={id}>{label}</label>
            <input className="input" id={id} name={id} {...props} required/>
        </p>
    );
}
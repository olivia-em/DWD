import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Piece3.module.css";

function SecretForm({
  onSubmit,
  loading,
  secret,
  setSecret,
  preposition,
  setPreposition,
  file,
  setFile,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={styles.piece3Form}
      encType="multipart/form-data"
    >
      <label className={styles.piece3Label}>
        Secrets
        <select
          value={preposition}
          onChange={(e) => setPreposition(e.target.value)}
          className={styles.piece3Select}
        >
          <option value="with">with</option>
          <option value="for">for</option>
          <option value="from">from</option>
        </select>
        &nbsp;you..
      </label>
      <input
        type="text"
        placeholder="?*/*^%#%$#@!$^&()(&%$@#$%^&?:"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        required
        className={styles.piece3Input}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className={styles.piece3File}
      />
      <button type="submit" disabled={loading} className={styles.piece3Button}>
        {loading ? "Submitting..." : "shh..."}
      </button>
    </form>
  );
}

const Piece3 = () => {
  const [secret, setSecret] = useState("");
  const [preposition, setPreposition] = useState("with");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [poem, setPoem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/secrets").then((res) => {
      if (res.data && res.data.length > 0) {
        setPoem(res.data[0]);
      }
    });
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("preposition", preposition);
    if (file) formData.append("image", file);
    try {
      await axios.post("/api/secrets", formData);
      setSecret("");
      setFile(null);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit. Please try again or check the server.");
    }
    setLoading(false);
  };

  if (submitted && poem) {
    return (
      <div
        className={styles.piece3Poem}
        style={{
          backgroundImage: poem.image
            ? `url(/${poem.image.replace(/^\//, "")})`
            : undefined,
        }}
      >
        <div className={styles.piece3PoemContent}>
          <p>
            we've kept a secret <em>{poem.preposition}</em> each other
          </p>
          <p>
            you've kept a secret <em>{poem.preposition}</em> me
            <br />
            you hold it, i know you do.
            <br />
            we'll never speak again, not like we used to.
          </p>
          <p>
            i've kept a secret <em>{poem.preposition}</em> you.
            <br />
            nothing said out loud.
            <br />
            i'll tell you now. because,
            <br />
            we'll never speak again, not like we used to.
          </p>
          <p style={{ fontStyle: "italic", margin: "20px 0" }}>{poem.secret}</p>
          <p>
            you can take it, this thing i've shared…
            <br />
            that, the love, and the care.
          </p>
        </div>
        {/* <button
          onClick={() => setSubmitted(false)}
          className={styles.piece3PoemBack}
        >
          Back to form
        </button> */}
      </div>
    );
  }

  return (
    <div className={styles.piece3Container}>
      <SecretForm
        onSubmit={handleSubmit}
        loading={loading}
        secret={secret}
        setSecret={setSecret}
        preposition={preposition}
        setPreposition={setPreposition}
        file={file}
        setFile={setFile}
      />
      {error && <div className={styles.piece3Error}>{error}</div>}
    </div>
  );
};

export default Piece3;

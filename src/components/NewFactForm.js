import React, { useState } from 'react';
import { CATEGORIES } from '../testData';
import supabase from '../supabase';

const isValidUrl = (urlString) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i' // validate fragment locator
  );
  return !!urlPattern.test(urlString);
};

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const textLength = text.length;

  async function handleSubmit(e) {
    // 1.) Prevent browser reload
    e.preventDefault();
    console.log(text, source, category);

    // 2.) Check if data is valid. If so, create a new fact
    if (text && isValidUrl(source) && category && textLength <= 200) {
      // 3.) Create a new fact object without supabase
      //   const newFact = {
      //     id: Math.round(Math.random() * 10000000),
      //     text,
      //     source,
      //     category,
      //     votesInteresting: 0,
      //     votesMindblowing: 0,
      //     votesFalse: 0,
      //     createdIn: new Date().getFullYear(),
      //   };

      // 3.) Upload fact to supabase and receive the new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from('facts')
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      // 4.) Add the new fact to the UI: add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      // 5.) Reset the input fields
      setText('');
      setSource('');
      setCategory('');

      // 6. Close the form
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

export { NewFactForm };

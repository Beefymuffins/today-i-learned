import './style.css';
import { useEffect, useState } from 'react';
import supabase from './supabase';

import { NewFactForm } from './components/NewFactForm';
import { FactList } from './components/FactList';
import { CategoryFilter } from './components/CategoryFilter';
import Header from './components/Header';
import { initialFacts } from './testData';
import Loader from './components/Loader';

// import Counter from './components/Counter';

function App() {
  // 1.) Define State Variable
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from('facts').select('*');
      if (currentCategory !== 'all')
        query = query.eq('category', currentCategory);

      const { data: fact, error } = await query
        .order('votesInteresting', { ascending: false })
        .limit(1000);

      if (!error) setFacts(fact);
      else alert('There was a problem getting data.');

      setIsLoading(false);
    }
    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />

        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

export default App;

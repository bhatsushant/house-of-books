import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BookDetails from './components/BooksDetails';
import NewAdditions from './components/NewAdditions';
import BooksList from './components/BooksList';
import Home from './components/Home';
import Library from './components/Library';
import MostPopular from './components/MostPopular';
import RecentBooks from './components/RecentBooks';
import Navigation from './components/Navigation';
import Authentication from './components/Authentication';
import ProfilePage from './components/ProfilePage';
import Checkout from './components/Checkout';
import './App.css';

const App = () => {
  return (
    <div>
      <Navigation />

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/books' element={<BooksList />} />
        <Route exact path='/books/:id' element={<BookDetails />} />
        <Route path='/auth' element={<Authentication />} />
        <Route exact path='/books/newAdditions' element={<NewAdditions />} />
        <Route exact path='/library' element={<Library />} />
        <Route exact path='/books/mostPopular' element={<MostPopular />} />
        <Route exact path='/books/recents' element={<RecentBooks />} />
        <Route exact path='/users/profile' element={<ProfilePage />} />
        <Route path='/checkout' element={<Checkout />} />
      </Routes>
    </div>
  );
};

export default App;

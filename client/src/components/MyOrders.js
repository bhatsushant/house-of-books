import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import noImage from '../assets/images/no-image.jpeg';
import {
  makeStyles,
  Card,
  CardActionArea,
  Grid,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
const useStyles = makeStyles({
  card: {
    maxWidth: 550,
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #222',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
    color: '#222',
  },
  titleHead: {
    borderBottom: '1px solid #222',
    fontWeight: 'bold',
    color: '#222',
    fontSize: 'large',
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  media: {
    height: '100%',
    width: '100%',
  },
  button: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const [bookDetailsData, setBookDetailsData] = useState(undefined);
  const [error, setError] = useState(false);
  let card = null;

  const { currentUser } = useContext(UserContext);
  console.log('Current user is ', currentUser.email);

  useEffect(() => {
    console.log('useEffect fired');
    async function fetchData() {
      try {
        console.log('Before axios call');
        const url = `http://localhost:4000/users/myorders`;
        const { data } = await axios.post(url, {
          data: currentUser.email,
        });
        console.log(data);
        setBookDetailsData(data);
        setLoading(false);
      } catch (e) {
        setError(true);
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const buildCard = (book) => {
    return (
      <Grid item xs={10} sm={7} md={5} lg={4} xl={3} key={book._id}>
        <Card className={classes.card} variant='outlined'>
          <CardActionArea>
            <Link to={`/books/${book._id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image={book.url ? book.url : noImage}
                title='book image'
              />
              <CardContent>
                <Typography
                  variant='body2'
                  color='textSecondary'
                  component='span'
                >
                  <p className='title1'>{book.title}</p>
                  <dl>
                    {book && book.totalPrice ? null : (
                      <p>
                        <dt className='title'>Rented Book</dt>
                      </p>
                    )}
                    <p>
                      <dt className='title'>Genre:</dt>
                      {book && book.genre ? (
                        <dd>{book.genre}</dd>
                      ) : (
                        <dd>N/A</dd>
                      )}
                    </p>
                    <p>
                      <dt className='title'>Total Price:</dt>
                      {book && book.totalPrice ? (
                        <dd>{book.totalPrice}</dd>
                      ) : (
                        <dd>7</dd>
                      )}
                    </p>
                    <p>
                      <dt className='title'>Quantity:</dt>
                      {book && book.quantity ? (
                        <dd>{book.quantity}</dd>
                      ) : (
                        <dd>1</dd>
                      )}
                    </p>
                    {book && book.dateOfPurchase ? (
                      <p>
                        <dt className='title'>Date of Order:</dt>
                        {book && book.dateOfPurchase ? (
                          <dd>{book.dateOfPurchase}</dd>
                        ) : (
                          <dd>N/A</dd>
                        )}
                      </p>
                    ) : (
                      <p>
                        <dt className='title'>Start Date:</dt>
                        {book && book.startDate ? (
                          <dd>{book.startDate}</dd>
                        ) : (
                          <dd>N/A</dd>
                        )}
                      </p>
                    )}
                    {book && book.endDate ? (
                      <p>
                        <dt className='title'>End Date:</dt>
                        {book && book.endDate ? (
                          <dd>{book.endDate}</dd>
                        ) : (
                          <dd>N/A</dd>
                        )}
                      </p>
                    ) : null}
                  </dl>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    if (error) {
      return (
        <div>
          <h2>No orders found</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Loading....</h2>
        </div>
      );
    }
  } else if (bookDetailsData && bookDetailsData.length === 0) {
    return (
      <div>
        <h2>No orders found in the order history</h2>
      </div>
    );
  } else {
    card =
      bookDetailsData &&
      bookDetailsData.map((book) => {
        return buildCard(book);
      });
    return (
      <div>
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default MyOrders;

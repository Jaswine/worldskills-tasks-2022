import React, { useEffect, useState } from 'react'
import styles from './Home.module.css'
import { $axios } from '../../api';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button/Button';

const Home = () => {
    const {name} = useAuth()
    const [gamesInfo, setGamesInfo] = useState([]);
    const [games, setGames] = useState([]);
    // for sorting
    const [sortBy, setSortBy] = useState('title')
    const [sortDir, setSortDir] = useState('asc')

    // for infinite scrolling
    const [page, setPage] = useState(1)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        document.title = 'Discover Games'
        getGames()
    }, [])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)

        return function() {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    // sort games
    useEffect(() => {
        getGames()
    }, [sortBy, sortDir])

    useEffect(() => {
        if (fetching) {
            getGames()
        }
    }, [fetching])

    const getGames = () => {
        $axios.get('/games', {
            params: {
                sortBy: sortBy,
                sortDir:  sortDir,
                page: page,
            }
        })
            .then((res) => {
                setGamesInfo(res.data)
                console.log(page)
                if (page == 1 ){
                    setGames(res.data.content)
                } else {
                    setGames([...games, ...res.data.content])
                }
                setPage(page+1)
            })
            .catch(err => {
                console.error(err);
            })
            setFetching(false)
    }

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setFetching(true);
        }
    }

  return (
    <div className='page'>
        <div className={styles.page__filters}>
            {gamesInfo? (
                <>
                    <span> {gamesInfo.totalElements} Games Available</span>
                    <div className={styles.sort_dir} >
                        <div className={styles.sort__game} >
                            <label >title</label>
                            <input 
                                type="checkbox" 
                                onChange={( ) => setSortBy('title')}   />
                        </div>
                        <div className={styles.sort__game} >
                            <label >uploaddate</label>
                            <input 
                                type="checkbox" 
                                onChange={( ) => setSortBy('uploaddate')}   />
                        </div>
                        <div 
                            className={styles.sort__game}
                         >
                            <label >popular</label>
                            <input 
                                type="checkbox" 
                                onChange={( ) => setSortBy('popular')}   />
                        </div>
                    </div>
                    <div className={styles.sort_dir} >
                        <div className={styles.sort__game} >
                            <label >asc</label>
                            <input 
                                type="checkbox" 
                                onChange={( ) => setSortDir('asc')}   />
                        </div>
                        <div className={styles.sort__game} >
                            <label >desc</label>
                            <input 
                                type="checkbox" 
                                onChange={( ) => setSortDir('desc')}   />
                        </div>
                    </div>
                </>
            ): (<></>)}
        </div>
        {games.length > 0 ? (
            <div className={styles.page__content}>
                {games.map((game, index) => 
                    <div className={styles.game} key={index}>
                        <div className={styles.game__header}>
                            <div className={styles.game__header__right}>
                                <a href={`/games/${game.slug}`}>{game.title}</a> 
                                 by <a href={`/users/${game.author}`}>${game.author}</a>
                            </div>
                            <div className={styles.game__header__left}>
                                # scores submitted: {game.scoreCount}
                            </div>
                        </div>
                        <div className={styles.game__header__body}>
                            <img src={game.thumbnail} alt={game.title} />
                            <p>{game.description}</p>
                        </div>
                        {name == game.author ? (
                           <div className="buttons">
                             <a className='btn'  href={`/games/${game.slug}/more`} >Update Game</a>
                           </div>
                        ) : (<></>)}
                    </div>
                )}
            </div>
        ) :(<>loading...</>)}
    </div>
  )
}

export default Home

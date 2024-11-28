import styles from './MyInstallmentPage.module.scss';

import React from 'react';
import MyNav from 'src/components/MyNav'; 
import FavoritePanel from 'src/components/FavoritePanel';

const MyInstallmentPage = () => {
    return (
        <main>
            <MyNav />

            <section className={ styles.favoriteSection }>
                <FavoritePanel />

                <div className={ styles.favoriteListDiv }>
                    Test
                </div>
            </section>
        </main>                
    );
};

export default MyInstallmentPage;

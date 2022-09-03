import Head from 'next/head';
import Layout from './../components/Layout';
import React from 'react';
import { Context } from 'vm';
import { InferGetServerSidePropsType } from 'next';
import { log } from '../../log';
import { search } from '../../services/search';
import Link from 'next/link';
import Image from 'next/image';
import { IComic } from '../../types/pages/comic/types';
import { useI18N } from '../../context/i18n';

const Search = ({ query, results }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useI18N();

  return (
    <>
      <Head>
        <title>xkcd - Results for {query}</title>
        <meta name="description" content={`Search results for ${query}`} />
      </Head>
      <Layout>
        <h1>{t('SEARCH_RESULTS_TITLE', results.length, query)}</h1>
        {
          results.map(result => {
            return(
              <Link href={`/comic/${result.id}`} key={result.id}>
                <a className='flex flex-row content-center justify-start bg-slate-300 hover:bg-slate-50'>
                  <Image width={50} height={50} src={result.img} className='rounded-full' alt={result.alt}/>
                  <div>
                    <h2>{result.title}</h2>
                  </div>
                </a>
              </Link>
            )
          })
        }
      </Layout>
    </>
  );
};

export default Search;

export const getServerSideProps = async (context: Context) => {
  const { query: { q: query = '' } } = context;

  // Algolia api call for result search
  const { results } : { results: IComic[] } = await search({query: query});
  return {
    props: { query, results }
  }
}
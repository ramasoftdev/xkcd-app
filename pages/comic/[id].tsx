import fs, { readFile, stat } from 'fs/promises';
import Head from 'next/head';
import Header from '../components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { basename } from 'path';
import { IComic } from '../../types/pages/comic/types';
import { InferGetStaticPropsType } from 'next';
// import { log } from './../../log';
import Layout from '../components/Layout';

export default function Comic({ comic, ...props }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <>
    <Head>
      <title>xkcd - Comics for developers</title>
      <meta name="description" content="Comics for developers" />
    </Head>

    <Layout>
      <main>
        <section className='max-w-lg m-auto'>
          <h1 className='font-bold text-xl text-center mb-4'>{comic.title}</h1>
          <div className='max-w-sm m-auto'>
            <Image
              layout='responsive'
              src={comic.img}
              width={comic.width}
              height={comic.height}
              alt={comic.alt}
            />
          </div>
          <p>{comic.alt}</p>
          <div className='flex justify-between mt-4 font-bold'>
            {
              props.hasPrevious && <Link href={`/comic/${props.prevId}`}>
                <a className='text-gray-600'>Previous</a>
              </Link>
            }
            {
              props.hasNext && <Link href={`/comic/${props.nextId}`}>
                <a className='text-gray-600'>Next</a>
              </Link>
            }
          </div>
        </section>
      </main>
    </Layout>

  </>
}

export const getStaticPaths = async ({ locales }: { locales: string[]}) => {
  const files = await fs.readdir('./comics');
  let paths: any[] = [];
  locales.forEach(locale => {
    paths = paths.concat(files.map(file => {
      const id = basename(file, '.json')
      return { params: { id }, locale }
    }));
  });

  // console.log(paths);
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async (context: any) => {
  const { params: { id } } = context;
  const content = await readFile(`./comics/${id}.json`, 'utf-8');
  const comic: IComic = JSON.parse(content);

  const prevId = +id - 1;
  const nextId = +id + 1;
  const results = await Promise.allSettled([
    stat(`./comics/${prevId}.json`),
    stat(`./comics/${nextId}.json`)
  ]);
  const [hasPrevious, hasNext] = [results[0].status == 'fulfilled', results[1].status == 'fulfilled']
  return {
    props: { comic, hasPrevious, hasNext, prevId, nextId }
  }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class BookController extends Controller
{
    public function search(): JsonResponse
    {
        $query = 'チーズの作り方';

        $response = Http::get('https://www.googleapis.com/books/v1/volumes', [
            'q'          => $query,
            'langRestrict' => 'ja',
            'maxResults' => 20,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch books'], 500);
        }

        $data  = $response->json();
        $items = $data['items'] ?? [];

        $books = array_map(function ($item) {
            $info = $item['volumeInfo'] ?? [];

            return [
                'id'          => $item['id'] ?? null,
                'title'       => $info['title'] ?? '不明',
                'authors'     => $info['authors'] ?? [],
                'description' => $info['description'] ?? null,
                'thumbnail'   => $info['imageLinks']['thumbnail'] ?? null,
                'infoLink'    => $info['infoLink'] ?? null,
            ];
        }, $items);

        return response()->json(['books' => $books, 'query' => $query]);
    }
}

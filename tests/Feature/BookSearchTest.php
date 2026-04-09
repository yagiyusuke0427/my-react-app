<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BookSearchTest extends TestCase
{
    public function test_book_search_returns_successful_response(): void
    {
        Http::fake([
            'https://www.googleapis.com/books/v1/volumes*' => Http::response([
                'items' => [
                    [
                        'id' => 'abc123',
                        'volumeInfo' => [
                            'title'      => 'チーズの作り方入門',
                            'authors'    => ['山田太郎'],
                            'description' => 'チーズを家庭で作る方法を詳しく解説した本。',
                            'imageLinks' => [
                                'thumbnail' => 'https://example.com/thumbnail.jpg',
                            ],
                            'infoLink' => 'https://books.google.com/books?id=abc123',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->get('/api/books/search');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'query',
            'books' => [
                '*' => ['id', 'title', 'authors', 'description', 'thumbnail', 'infoLink'],
            ],
        ]);
        $response->assertJsonFragment(['title' => 'チーズの作り方入門']);
        $response->assertJsonFragment(['query' => 'チーズの作り方']);
    }

    public function test_book_search_returns_error_when_api_fails(): void
    {
        Http::fake([
            'https://www.googleapis.com/books/v1/volumes*' => Http::response([], 500),
        ]);

        $response = $this->get('/api/books/search');

        $response->assertStatus(500);
        $response->assertJsonFragment(['error' => 'Failed to fetch books']);
    }
}

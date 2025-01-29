<?php

use App\Http\Controllers\DestinationController;
use App\Http\Controllers\LayoffController;
use App\Http\Controllers\MilitaryController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\RankController;
use App\Http\Controllers\SubunitController;
use App\Http\Controllers\WorkplaceController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


// Admin routes.
Route::get('/users', [UserController::class, 'index']);


// Login and register routes.
Route::post('users/login', [UserController::class, 'login'])->name('users.login');
Route::post('users/register', [UserController::class, 'store'])->name('users.store');
Route::get('/users/{user}', [UserController::class, 'show']);
Route::put('/users/{id}/change-password', [UserController::class, 'changePassword']);


Route::resource('destinations', DestinationController::class);
Route::resource('ranks', RankController::class);
Route::resource('subunits', SubunitController::class);
Route::resource('militaries', MilitaryController::class);
Route::resource('workplaces', WorkplaceController::class);
Route::resource('layoffs', LayoffController::class);


// Military and presence routes.
Route::post('presence/militaries',[MilitaryController::class, 'militariesNotInPresence'])->name('presence.militaries');
Route::post('presence-made/militaries',[MilitaryController::class, 'militariesInPresenceMade'])->name('presence.done');
Route::post('presences/insert', [PresenceController::class, 'insert'])->name('presences.insert');
Route::patch('presences/{presence}', [PresenceController::class, 'update'])->name('presences.update');
Route::post('militaries/list',[MilitaryController::class, 'getMilitaries'])->name('militaries.list');
Route::post('presence-made/total-militaries',[MilitaryController::class, 'totalMilitariesInPresenceMade'])->name('total.presence.done');
Route::put('/militaries/{military}/change-subunit', [MilitaryController::class, 'changeSubunit']);


// Layoff routes.
Route::post('layoff/militaries',[LayoffController::class, 'militariesNotInLayoff'])->name('layoff.militaries');
Route::post('layoff/presence',[LayoffController::class, 'militariesInLayoff'])->name('layoff.presence');
Route::get('/layoff/{id}', [LayoffController::class, 'show']);


/*
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
*/
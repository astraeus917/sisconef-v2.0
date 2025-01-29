<?php

namespace App\Http\Controllers;

use App\Models\Workplace;
use Illuminate\Http\Request;

class WorkplaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $workplaces = Workplace::all();
        return response()->json($workplaces);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Workplace $workplace)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Workplace $workplace)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Workplace $workplace)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workplace $workplace)
    {
        //
    }
}

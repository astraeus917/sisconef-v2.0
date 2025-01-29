<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Presence;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function insert(Request $request)
    {
        \Log::info('Request received: ' . json_encode($request->all()));

        $presences = json_decode($request->presences, true);
        $destinations = json_decode($request->destinations, true);

        \Log::info('Presences: ' . print_r($presences, true));
        \Log::info('Destinations: ' . print_r($destinations, true));

        $insert_info = [];

        if (!empty($presences)) {
            foreach ($presences as $presence) {
                $destinationId = Destination::getIdByDestination($presence['destination']);
                \Log::info('Destination ID for presence ' . $presence['id'] . ': ' . $destinationId);
                $insert_info[] = [$presence['id'], $destinationId];
            }            
        }

        if (!empty($destinations)) {
            foreach ($destinations as $destination) {
                $destinationId = Destination::getIdByDestination($destination['destination']);
                \Log::info('Destination ID for destination ' . $destination['id'] . ': ' . $destinationId);
                $insert_info[] = [$destination['id'], $destinationId];
            }            
        }

        date_default_timezone_set('America/Sao_Paulo'); // Sets the default time zone for Brazil.
        $dados = [];
        $currentDate = date('Y-m-d');
        $currentDateTime = date('Y-m-d H:i:s');

        for ($i = 0; $i < count($insert_info); $i++) {
            array_push($dados, [
                'military_id' => $insert_info[$i][0],
                'destination_id' => $insert_info[$i][1],
                'date' => $currentDate,
                'created_at' => $currentDateTime,
            ]);
        }

        \Log::info('Data to be inserted: ' . print_r($dados, true));

        try {
            Presence::insert($dados);

            return response()->json([
                'message' => 'Faltas tiradas com sucesso!',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error inserting data: ' . $e->getMessage());
            return response()->json(
                [
                    'message' => 'Ocorreu um erro ao tirar as faltas!',
                ],
                500,
            );
        }
    }

    public function update(Request $request, Presence $presence)
    {
        $request->validate([
            'destination_id'=>'required',
        ]);

        try{

            $presence->destination_id = $request->destination_id;
            $presence->update();

            return response()->json([
                'message'=>'Destino do militar atualizado com sucesso!'
            ]);

        }catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Algo deu errado ao atualizar as informações do militar!'
            ],500);
        }
    }
}

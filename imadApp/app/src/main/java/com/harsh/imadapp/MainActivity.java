package com.harsh.imadapp;

import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final TextView textView = (TextView) findViewById(R.id.textview);
        final EditText editText = (EditText) findViewById(R.id.edittext);
        Button button = (Button) findViewById(R.id.replacebutton);

        button.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                String content = editText.getText().toString().trim();
                if(content.isEmpty())
                {
                    showAlert();
                    //Toast.makeText(MainActivity.this, "No text was entered!", Toast.LENGTH_SHORT).show();
                }
                else if(content.equals(textView.getText().toString().trim()))
                {
                    editText.setText("");
                    Toast.makeText(MainActivity.this, "Entered text is same!", Toast.LENGTH_SHORT).show();
                }
                else
                {
                    textView.setText(content);
                    editText.setText("");
                    Toast.makeText(MainActivity.this, "Text Changed!", Toast.LENGTH_LONG).show();
                }
            }
        });
    }

    private void showAlert()
    {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Empty");
        builder.setMessage("No String to replace");
        builder.setNeutralButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
            }
        });

        builder.show();
    }
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Screenshotter : MonoBehaviour {
	public TextMesh text;
	public void Awake() {
		float r = 1, g = 1, b = 1;

		// Read r, g and b parameters passed into the query as <URL>?r=0.5?g=0?b=0.1
		string [] url_query = Application.absoluteURL.Split(new char[]{'?'}); 
		if (url_query.Length == 2) {
			var query = url_query[1];
			string [] assignments = query.Split(new char[]{'&'});
			foreach(string assignment in assignments) {
				string [] pair = assignment.Split(new char[]{'='});
				string lhs = WWW.UnEscapeURL(pair[0]);
				float rhs = float.Parse(WWW.UnEscapeURL(pair[1]));
				if (lhs == "r") r = rhs;
				else if (lhs == "g") g = rhs;
				else if (lhs == "b") b = rhs;
			}
		}
		
		// Color the text according to instruction in URL
		text.color = new Color(r, g, b, 1);

		// Wait for a frame to render
        StartCoroutine("snapshot");
    }

    IEnumerator snapshot() {
        yield return new WaitForEndOfFrame();
        Debug.Log("Screenshotter: capture now");
    }
}
